%%%-------------------------------------------------------------------
%%% @author Federico Minniti, Tommaso Baldi, Matteo Del Seppia
%%% @copyright (C) 2022, <group_mbds>
%%% @doc
%%%
%%% @end
%%% Created : 07. feb 2022 19:05
%%%-------------------------------------------------------------------
-module(web_socket_handler).
-author("group_mbds").

-export([init/2, websocket_init/1, websocket_handle/2, websocket_info/2, terminate/3]).


% The init/2 callback is called when the request is received. To establish a Websocket connection we must have to switch to the
% cowboy_websocket module
init (Req, State) ->
	{cowboy_websocket, Req, State,
   		#{idle_timeout => infinity}
  	}.

% Websocket callbacks returns the tuple {[Frame], State}, where the frame list will be returned to the client.
% If nothing is returned, it reply {ok, State}
websocket_init (State) ->
  	{ok, State}.

% Cowboy will call websocket_info/2 whenever an Erlang message arrives.
% It communicate to the server the termination of terminate the connection
websocket_info (stop, State) ->
  	{stop, State};

% It is used to excange messages between two process
websocket_info(Info, State) ->
  	{[{text, Info}], State}.

% Cowboy each time receive a frame from the client call websocket_handle/2
websocket_handle ({text, Text}, State) ->
  	io:format("Frame received: ~p\n", [Text]),
  	% JSX (it use binary data):
  	%		<< ... >>: cast a bit string into an atom
  	% 		decode: convert an utf8 encoded binary json text to an erlang term
  	%		encode
  	TextAsMap = jsx:decode(Text, [return_maps]),
  	TypeOfMessage = erlang:binary_to_atom(maps:get(<<"type">>, TextAsMap)),
  	SenderName = erlang:binary_to_atom(maps:get(<<"sender">>, TextAsMap)),
  	case TypeOfMessage of
    		user_online ->
      	  		SenderPID = whereis(SenderName),
      			if
        			SenderPID =/= undefined ->
          				ResponseAsText = jsx:encode(#{<<"type">> => <<"logged_sender_error">>}),
          		  		NewState = State,
          		  		self() ! ResponseAsText;
        			true ->
          		  		register(erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap)), self()),
		  		  	NameProcess = erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap)),
		  		  	online_users ! {NameProcess, {update_online_user, add}},
		  		  	NewState = {waiting_opponent, SenderName}
      			end;
		
    		opponent_registration ->
			online_users ! {SenderName, {update_online_user, user_in_game}},
      			NewState = {opponent_user, erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap))};
		
		random_opponent ->
			online_users ! {SenderName, search_random_opponent},
			NewState = {search_random_opponent, SenderName};
		
		_ -> % types of message [battleship_request, battleship_accepted, decline_battle_request, chat_message, ready, shoot, miss, hit, sunk, surrender, timeout]
      	  		Receiver = erlang:binary_to_atom(maps:get(<<"receiver">>, TextAsMap)),
			NewState = State,
			try Receiver ! Text of
				_ -> io:format("Frame sent\n")
			catch
				Throw -> io:format("Destination unreachable\n")
			end
	end,
  	{ok, NewState};

websocket_handle (_, State) -> 
	{ok, State}.

% terminate/3 handles the termination of the connection
% Terminate reasons are:
% 	stop -> The server close the connection
% 	remote -> The client close the connection

terminate (TerminateReason, _Req, {opponent_user, OpponentUsername}) ->
  	io:format("Terminate reason: ~p\n", [TerminateReason]),
  	OpponentPID = whereis(OpponentUsername),
  	if
    		OpponentPID =/= undefined -> 
      			OpponentPID ! jsx:encode(#{<<"type">> => <<"opponent_disconnected">>});
    		true ->
      	  		ok
  	end;
  
terminate (TerminateReason, _Req, {search_random_opponent, User}) ->
	online_users ! {User, {update_online_user, remove}},
  	io:format("~s found an opponent\n", [User]),
  	io:format("Terminate reason: ~p\n", [TerminateReason]);
  
terminate (TerminateReason, _Req, {waiting_opponent, User}) ->
  	online_users ! {User, {update_online_user, remove}},
  	io:format("Terminate reason: ~p\n", [TerminateReason]);

terminate (TerminateReason, _Req, {}) ->
  	io:format("Terminate reason: ~p\n", [TerminateReason]),
  	io:format("Terminate with empty state ~n").


% The module cowboy_websocket implements Websocket as a Ranch protocol.
% It defines a callback interface for handling Websocket connections.
% CowBoy uses different processes for handling each client connection.
