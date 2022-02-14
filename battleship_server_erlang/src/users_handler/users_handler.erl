%%%-------------------------------------------------------------------
%%% @author Federico Minniti, Tommaso Baldi, Matteo Del Seppia
%%% @copyright (C) 2022, <group_mbds>
%%% @doc
%%%
%%% @end
%%% Created : 07. feb 2022 19:05
%%%-------------------------------------------------------------------
-module(users_handler).
-author("group_mbds").

%% API
-export([init_server/0]).

% function to start the server
init_server() ->
  Server = self(),
  BattleShipPid = spawn( fun() -> battleship_daemon(Server, #{}) end ),
  RandomOpponentPid = spawn( fun() -> random_opponent_daemon(null) end ),
  server_loop(BattleShipPid, RandomOpponentPid).

% server node loop
server_loop(BattleShipPid, RandomOpponentPid) ->
  	receive
		{From, {update_online_user, Operation} } ->
			BattleShipPid ! {From, Operation},
			server_loop(BattleShipPid, RandomOpponentPid);
	  
		{From, search_random_opponent} ->
			RandomOpponentPid ! {From, search_random_opponent},
			server_loop(BattleShipPid, RandomOpponentPid);
		
    	{From, {stop} } ->
      		BattleShipPid ! {self(), stop},
      		From ! {ok};
    	_ ->  %any out-of-domain [interaction, stop] message is skipped
      		server_loop(BattleShipPid, RandomOpponentPid)
  	end.
  
random_opponent_daemon(User) -> %%MANDARE MESS A CLIENT SINGOLI ANCHE
	receive
		{From, search_random_opponent} ->
			if
				(User == null) -> 
					NewUser = From,
					random_opponent_daemon(NewUser);
				true -> 
					%<<"sender">> => erlang:atom_to_binary(From)
					MessageUser = jsx:encode(#{<<"type">> => <<"battleship_accepted">>, <<"sender">> => From}),
					User ! MessageUser,
					MessageFrom = jsx:encode(#{<<"type">> => <<"battleship_accepted">>, <<"sender">> => User}),
					From ! MessageFrom,
					NewUser = null,
					random_opponent_daemon(NewUser)
			end
	end.

%battleship daemon waits connection from
battleship_daemon(Server, OnlineUsers) ->
  receive
    {From, add} ->
      UpdatedOnlineUsers = maps:put(From, in_lobby, OnlineUsers),
      send_all(UpdatedOnlineUsers),  %% publish the updated version of the available users where 'From' has been added
      io:format("New user available: ~s ", [From]),
      io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
      battleship_daemon(Server, UpdatedOnlineUsers);
	  
	{From, user_in_game} ->
		UpdatedOnlineUsers = maps:put(From, in_game, OnlineUsers),
		send_all(UpdatedOnlineUsers),
		update_all(UpdatedOnlineUsers, From),
		io:format("~s starts a game", [From]),
		battleship_daemon(Server, UpdatedOnlineUsers);
		
    {From, remove} ->
      UpdatedOnlineUsers = maps:remove(From, OnlineUsers),
      send_all(UpdatedOnlineUsers),  %% publish the updated version of the available users where 'From' has been removed
      update_all(UpdatedOnlineUsers, From),  %% all game requests coming from this user are deleted
      io:format("~s is now offline\n", [From]),
      io:format("Online users: ~w ~n", [UpdatedOnlineUsers]),
      battleship_daemon(Server, UpdatedOnlineUsers);
    {Server, stop} ->
      ok;
    _ -> battleship_daemon(Server, OnlineUsers)  %any out-of-domain [add, remove, stop] message is skipped
  end.


% It sends a message to all clients ready to start a new match
send_all(Map) ->
	Pred = fun(K,V) -> (V =:= in_lobby) end,
	Filtered = maps:filter(Pred, Map),
	List = maps:keys(Filtered),
  	send_all(List, List).

send_all([], _) -> ok;

send_all([First|Others], Data) ->
  if
    (is_list(Data)) ->  %% if it is a list, it means that the list of online users has been updated
      First ! jsx:encode(#{<<"type">> => <<"updated_online_users">>, <<"data">> => Data});
    true -> %% otherwise, it is the username of a user who is no longer online
      First ! jsx:encode(#{<<"type">> => <<"remove_user_requests">>, <<"data">> => Data})
  end,
  send_all(Others, Data).
  
update_all(Map, From) ->
	Pred = fun(K,V) -> (V =:= in_lobby) end,
	Filtered = maps:filter(Pred, Map),
	List = maps:keys(Filtered),
  	send_all(List, From).
