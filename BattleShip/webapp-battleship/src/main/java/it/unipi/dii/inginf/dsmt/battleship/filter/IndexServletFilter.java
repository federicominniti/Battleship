package it.unipi.dii.inginf.dsmt.battleship.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebFilter(filterName = "IndexServletFilter", urlPatterns = {"/index.jsp"}, servletNames = {"IndexServlet"})
public class IndexServletFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    /**
     * Prevents logged users from visiting the login/register page,
     * by checking the session variable.
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpSession session = request.getSession();

        if (session.getAttribute("loggedUser") != null) {
            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
        } else {
            filterChain.doFilter(request, response);
        }
    }

    public void destroy() {}
}
